import { Server, Socket } from 'socket.io';

interface DrawData {
  x: number;
  y: number;
  color: string;
  size: number;
  tool: string;
}

interface Room {
  users: Set<string>;
  canvas: any[];
}

const rooms = new Map<string, Room>();

export const initializeSocketIO = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('🎃 User connected:', socket.id);

    // Join collaboration room
    socket.on('join-room', (roomId: string) => {
      socket.join(roomId);
      
      if (!rooms.has(roomId)) {
        rooms.set(roomId, { users: new Set(), canvas: [] });
      }
      
      const room = rooms.get(roomId)!;
      room.users.add(socket.id);
      
      socket.to(roomId).emit('user-joined', { userId: socket.id, userCount: room.users.size });
      socket.emit('room-state', { canvas: room.canvas, userCount: room.users.size });
    });

    // Drawing events
    socket.on('draw', (data: { roomId: string; drawData: DrawData }) => {
      const room = rooms.get(data.roomId);
      if (room) {
        room.canvas.push(data.drawData);
        socket.to(data.roomId).emit('draw', data.drawData);
      }
    });

    // Clear canvas
    socket.on('clear-canvas', (roomId: string) => {
      const room = rooms.get(roomId);
      if (room) {
        room.canvas = [];
        socket.to(roomId).emit('canvas-cleared');
      }
    });

    // Leave room
    socket.on('leave-room', (roomId: string) => {
      const room = rooms.get(roomId);
      if (room) {
        room.users.delete(socket.id);
        socket.to(roomId).emit('user-left', { userId: socket.id, userCount: room.users.size });
        
        if (room.users.size === 0) {
          rooms.delete(roomId);
        }
      }
      socket.leave(roomId);
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log('👻 User disconnected:', socket.id);
      
      rooms.forEach((room, roomId) => {
        if (room.users.has(socket.id)) {
          room.users.delete(socket.id);
          socket.to(roomId).emit('user-left', { userId: socket.id, userCount: room.users.size });
          
          if (room.users.size === 0) {
            rooms.delete(roomId);
          }
        }
      });
    });
  });
};
