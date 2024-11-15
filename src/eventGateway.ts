import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayDisconnect,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatRoomService } from './chat-room/chat-room.service';
import { ChatMessageService } from './chat-message/chat-message.service';

//클라이언트의 패킷들이 게이트웨이를 통해서 들어오게 됩니다.
@WebSocketGateway({ namespace: '/socket/chatting', cors: '*' })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  // 소켓 서버를 정의합니다.
  @WebSocketServer()
  server: Server;
  // 유저 정보를 레디스에 적재시키기 위해서 레디스 설정이 선행되야합니다.
  constructor(
    private readonly chatRoomService: ChatRoomService,
    private readonly chatMessageService: ChatMessageService,
  ) {}
  /*
     유저정보는 같지만 소켓이 여러개가 연결되어 있을 경우
     핸들링 할수있게 유저정보와 소켓 연결정보에 대한
     분기처리가 필요합니다.
   */
  private connectedClients = [];

  afterInit(server: Server) {
    console.log('Initialized', JSON.stringify(server.sockets));
  }

  handleConnection(client: Socket) {
    console.log('Connected', client.id);
    this.addClient(client); // 괄호 추가
  }

  handleDisconnect(client: Socket) {
    console.log('Disconnected', client.id);
    this.removeClient(client);
  }

  // 클라이언트 추가 메서드
  addClient(client: any) {
    this.connectedClients.push(client.id);
  }

  // 클라이언트 삭제 메서드
  removeClient(client: any) {
    const index = this.connectedClients.indexOf(client.id);
    if (index !== -1) {
      this.connectedClients.splice(index, 1);
    }
  }

  @SubscribeMessage('getChatRooms')
  async handleGetChatRooms(client: Socket, payload: { userId: number }) {
    const chatRooms = await this.chatRoomService.getChatRoomsWithLatestMessage(
      payload.userId,
    );
    client.emit('chatRoomList', chatRooms);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    client: Socket,
    payload: {
      chatRoomId: number;
      toUserId: number;
      message: string;
      fromUserId: number;
      createdAt: string;
    },
  ) {
    const { chatRoomId, toUserId, message, fromUserId, createdAt } = payload;

    // 메시지 저장 로직
    const newMessage = await this.chatMessageService.saveMessage(
      chatRoomId,
      toUserId,
      message,
      fromUserId,
      createdAt,
    );

    // 채팅방 리스트 업데이트
    const chatRooms =
      await this.chatRoomService.getChatRoomsWithLatestMessage(fromUserId);
    client.emit('chatRoomList', chatRooms);

    // 해당 채팅방에 있는 모든 사용자에게 메시지 전송
    this.server.to(String(chatRoomId)).emit('newMessage', newMessage);
  }

  @SubscribeMessage('getChatRoomMessages')
  async handleGetChatRoomMessages(
    client: Socket,
    payload: { chatRoomId: number },
  ) {
    const messages = await this.chatMessageService.getMessagesByChatRoomId(
      payload.chatRoomId,
    );
    client.emit('chatRoomMessages', messages); // 클라이언트에 메시지 리스트 전송
  }

  @SubscribeMessage('joinChatRoom')
  handleJoinChatRoom(client: Socket, payload: { chatRoomId: number }) {
    client.join(String(payload.chatRoomId));
  }
}
