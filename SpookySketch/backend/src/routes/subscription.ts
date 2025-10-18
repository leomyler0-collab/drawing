import express, { Request, Response } from 'express';
import Stripe from 'stripe';
import User from '../models/User';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Create checkout session
router.post('/create-checkout-session', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { tier } = req.body;
    const user = req.user!;

    if (!['pro', 'vip'].includes(tier)) {
      return res.status(400).json({ error: 'Invalid tier' });
    }

    const prices = {
      pro: 499, // $4.99 in cents
      vip: 999, // $9.99 in cents
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `SpookySketch ${tier.toUpperCase()} Plan`,
              description: `${tier === 'pro' ? 'Advanced brushes, layers, cloud storage' : 'All Pro features + priority access + special brushes'}`,
            },
            unit_amount: prices[tier as 'pro' | 'vip'],
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL}/dashboard?success=true&tier=${tier}`,
      cancel_url: `${process.env.CLIENT_URL}/pricing?canceled=true`,
      customer_email: user.email,
      metadata: {
        userId: user._id.toString(),
        tier,
      },
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Checkout session error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Stripe webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return res.status(400).send('Missing signature or webhook secret');
  }

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

    switch (event.type) {
      case 'checkout.session.completed':
        const session: any = event.data.object;
        const userId = session.metadata.userId;
        const tier = session.metadata.tier;

        await User.findByIdAndUpdate(userId, {
          tier,
          stripeCustomerId: session.customer,
          subscriptionId: session.subscription,
          subscriptionStatus: 'active',
        });
        break;

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription: any = event.data.object;
        await User.findOneAndUpdate(
          { subscriptionId: subscription.id },
          {
            subscriptionStatus: subscription.status,
            tier: subscription.status === 'active' ? 'pro' : 'free',
          }
        );
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error}`);
  }
});

// Get subscription status
router.get('/status', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;

    if (!user.subscriptionId) {
      return res.json({
        tier: user.tier,
        status: 'none',
      });
    }

    const subscription = await stripe.subscriptions.retrieve(user.subscriptionId);

    res.json({
      tier: user.tier,
      status: subscription.status,
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ error: 'Failed to fetch subscription status' });
  }
});

// Cancel subscription
router.post('/cancel', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;

    if (!user.subscriptionId) {
      return res.status(400).json({ error: 'No active subscription' });
    }

    await stripe.subscriptions.update(user.subscriptionId, {
      cancel_at_period_end: true,
    });

    res.json({ message: 'Subscription will cancel at period end' });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

export default router;
