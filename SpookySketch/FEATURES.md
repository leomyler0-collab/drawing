# 🎃 SpookySketch Features Documentation

## 🎨 Drawing Studio Features

### Core Drawing Tools
- **Brush Tool**: Smooth, pressure-like strokes with customizable size
- **Eraser**: Remove parts of your drawing
- **Ghost Brush**: Special glowing brush with trail effects
- **Pumpkin Stamp**: Halloween-themed emoji stamping tool
- **Shape Tools**: Lines, circles, rectangles (Pro/VIP)

### Customization Options
- **Color Picker**: Full RGB color selection
- **Halloween Palette**: Pre-selected spooky colors (orange, purple, green, etc.)
- **Brush Size**: 1-50px adjustable
- **Opacity Control**: 0-100% transparency
- **Zoom**: 50-200% canvas scaling

### Canvas Controls
- **Undo/Redo**: Full action history (up to 50 steps)
- **Clear Canvas**: Reset entire drawing
- **Save**: Store to cloud (MongoDB)
- **Download**: Export as PNG
- **Layers**: Multiple drawing layers (Pro/VIP)

### Halloween Effects
- **Ghost Cursor Trail**: Animated trail follows cursor while drawing
- **Glowing Borders**: Canvas border pulses with orange glow
- **Shadow Effects**: Brushes can have soft glow/shadow
- **Fog Overlay**: Subtle animated fog at bottom of screen

---

## 🔐 Authentication System

### Sign Up
- Username (3-30 characters)
- Email validation
- Password (min 6 characters)
- Automatic JWT token generation
- Bcrypt password hashing

### Login
- Email/password authentication
- JWT token with 30-day expiry
- Session persistence via cookies
- Auto-redirect to dashboard

### Security Features
- Password hashing (bcrypt, 10 rounds)
- JWT token verification
- Protected API routes
- Secure HTTP-only cookies (production)
- Rate limiting (100 req/15min)

---

## 💰 Subscription Tiers

### Free Tier ($0)
- ✅ 1 saved drawing
- ✅ Basic brushes (brush, eraser)
- ✅ Standard canvas (no layers)
- ✅ PNG export only
- ✅ Gallery access
- ✅ Ghost brush effect

### Pro Tier ($4.99/month)
- ✅ 50 saved drawings
- ✅ All basic brushes
- ✅ Advanced shape tools
- ✅ **Layer system** (multiple layers)
- ✅ Cloud storage
- ✅ PNG, JPEG, SVG export
- ✅ Priority customer support
- ✅ No watermarks

### VIP Tier ($9.99/month)
- ✅ **Unlimited drawings**
- ✅ All Pro features
- ✅ Special Halloween brushes
- ✅ Real-time collaboration rooms
- ✅ Priority server access
- ✅ Early access to new features
- ✅ VIP badge on profile
- ✅ Exclusive templates
- ✅ Custom brush creation

---

## 📊 Dashboard Features

### Profile Section
- User avatar (emoji)
- Username display
- Email address
- Current tier status
- Member since date

### Statistics
- Total drawings count
- Drawing limit by tier
- Total views across all drawings
- Total likes received
- Public vs private drawings

### Drawing Management
- Grid view of all saved drawings
- Thumbnail previews
- Edit button (opens in studio)
- Delete button with confirmation
- View count per drawing
- Like count per drawing
- Creation date

### Quick Actions
- **New Drawing**: Opens studio
- **Upgrade**: Goes to pricing page
- **Edit Profile**: Update username/avatar (future feature)

---

## 🖼️ Gallery Features

### Public Gallery
- Browse community drawings
- Infinite scroll / pagination
- View counts
- Like system
- Artist attribution (username + avatar)
- Sort by: Latest, Most liked, Most viewed
- Search by tags (future)

### Drawing Cards
- Thumbnail preview
- Title
- Artist info
- Stats (views, likes)
- Click to view full size (future)
- Report inappropriate content (future)

---

## 🌐 Real-Time Collaboration (Socket.io)

### Collaboration Rooms
- Create/join drawing sessions
- Unique room IDs
- Multiple users per room
- Live user count

### Real-Time Features
- **Live Drawing Sync**: See others draw in real-time
- **Brush Position**: Cursor positions of collaborators
- **Color Sync**: See what colors others are using
- **Canvas State**: Shared canvas data
- **User Join/Leave**: Notifications when users connect

### Room Management
- Automatic room creation
- Room cleanup when empty
- Canvas history persistence
- Session recovery

---

## 🎃 Halloween Theme

### Visual Design
- **Background**: Deep black (#0C0C0F)
- **Primary Color**: Pumpkin orange (#FF6B00)
- **Secondary Color**: Mystic purple (#B660FF)
- **Text Color**: Ghost white (#F5F5F5)
- **Card Background**: Dark gray (#1A1A1F)

### Animations
- **Floating Elements**: Pumpkins, ghosts float up and down
- **Glow Effects**: Buttons and borders glow on hover
- **Fog Effect**: Bottom screen fog animation
- **Ghost Trails**: Cursor trail when drawing
- **Flicker**: Subtle candle-like flicker on UI elements

### Typography
- **Headers**: Creepster font (Google Fonts)
- **Body**: Inter font (clean, modern)
- **Sizes**: Responsive scaling

### UI Components
- **Spooky Buttons**: Orange gradient with glow
- **Spooky Cards**: Dark with orange border
- **Spooky Inputs**: Dark with orange focus ring
- **Modal Overlays**: Black backdrop with blur

---

## 📱 Responsive Design

### Desktop (1024px+)
- Full sidebar toolbars
- Large canvas area
- Settings panel on right
- Grid gallery layout (4 columns)

### Tablet (768px - 1023px)
- Collapsible sidebars
- Medium canvas
- Overlay settings panel
- Grid gallery (3 columns)

### Mobile (< 768px)
- Bottom toolbar
- Full-width canvas
- Drawer settings
- Grid gallery (2 columns)
- Touch-optimized controls

---

## 🔧 Technical Features

### Frontend
- **Framework**: Next.js 14 (App Router)
- **State Management**: React Context
- **HTTP**: Axios with interceptors
- **WebSockets**: Socket.io client
- **Animations**: Framer Motion
- **Toast Notifications**: React Hot Toast

### Backend
- **Server**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + bcrypt
- **Payments**: Stripe
- **Real-time**: Socket.io server
- **Security**: Helmet, CORS, rate limiting

### Storage
- **Drawings**: MongoDB (Base64 or GridFS)
- **User Data**: MongoDB
- **Sessions**: JWT tokens
- **Images**: Can integrate S3 (future)

---

## 🚀 Performance Optimizations

### Frontend
- Code splitting with Next.js
- Image optimization
- Lazy loading components
- Debounced drawing events
- Canvas memory management

### Backend
- MongoDB indexing (userId, createdAt)
- Query optimization
- Compression middleware
- Response caching (future)
- Connection pooling

### Canvas
- RequestAnimationFrame for smooth drawing
- Offscreen canvas for layers
- History compression
- Efficient stroke rendering

---

## 🔜 Future Features (Roadmap)

### Planned Features
- [ ] OAuth login (Google, GitHub)
- [ ] Custom brush creator
- [ ] Animation timeline
- [ ] AI-powered sketch suggestions
- [ ] Mobile app (React Native)
- [ ] Video tutorials
- [ ] Templates library
- [ ] Contest system
- [ ] NFT minting integration
- [ ] Dark/Light mode toggle

### Community Requested
- [ ] 3D drawing mode
- [ ] Collaborative playlists
- [ ] Voice chat in rooms
- [ ] Drawing battles/competitions
- [ ] Seasonal themes beyond Halloween

---

## 📈 Analytics (Future)

### User Analytics
- Drawing time tracking
- Most used colors
- Popular brushes
- Session duration
- Engagement metrics

### App Analytics
- Active users
- Conversion rates (Free → Pro → VIP)
- Feature usage
- Performance metrics
- Error tracking

---

**For detailed API documentation, see README.md**

**For setup instructions, see SETUP_GUIDE.md**
