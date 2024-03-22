const io = require('socket.io');
const User = require('../models/User.model');
const Drawing = require('../models/Drawing.model');

const {
  ADD_USER,
  REMOVE_USER,
  UPDATE_CANVAS,
  NOTIFY_USERS,
  CHANGE_VISIBILITY,
  NEW_COLLABORATOR,
  COLLABORATORS_UPDATED,
} = require('../constants/ws.constant');

let onlineUsers = [];

const initSocketIOEvents = (socket) => {
  /**
   * @param {string} payload.userId
   */
  const joinRoom = ({ userId }) => {
    const existingIndex = onlineUsers.findIndex(({ userId: uId }) => uId === userId);

    if (existingIndex >= 0) {
      return;
    }

    socket.join(userId);
    onlineUsers.push({ userId, socketId: socket.id });
  };

  const leaveRoom = ({ userId }) => {
    const removedOnlineUser = onlineUsers.splice(onlineUsers.findIndex(({ userId: uId }) => uId === userId), 1)[0];

    if (!removedOnlineUser) {
      return;
    }

    socket.leave(removedOnlineUser.userId);
  };

  /**
   * @typedef {{
   *     revisionId: string,
   *     content: object,
   * }} Payload
   * @type {Payload}
   */
  const broadcastUpdateCanvas = ({ revisionId, content }) => {
    OnlineUsers.forEach(({ userId }) => {
      sendNotificationToUser({ userId, notificationType: UPDATE_CANVAS, payload: { revisionId, content } });
    });
  };

  /**
   * @typedef {{
   *     recipientIds: Array<string>,
   *     senderId?: string,
   *     notifyType: string,
   * }} Notification
   * @param {Notification} payload
   */
  const sendNotificationToUser = ({ recipientIds = [], notifyType, senderId, payload }) => {
    recipientIds.forEach((recipientId) => {
      io.to(recipientId).emit(notifyType, payload);
    });
  };

  const emitVisibilityChanged = ({ drawerId, changedBy }) => {
    sendNotificationToUser({
      recipientIds: [drawerId],
      notifyType: CHANGE_VISIBILITY,
      payload: null,
      senderId: changedBy,
    });
  };

  const announceCollaboratorAdded = ({ targetId, initiatorId }) => {
    sendNotificationToUser({
      recipientIds: [targetId],
      notifyType: NEW_COLLABORATOR,
      payload: null,
      senderId: initiatorId,
    });
  };

  const propagateCollaboratorsUpdated = ({ targetId }) => {
    sendNotificationToUser({
      recipientIds: [targetId],
      notifyType: COLLABORATORS_UPDATED,
      payload: null,
    });
  };

  socket.on(ADD_USER, joinRoom);
  socket.on(REMOVE_USER, leaveRoom);
  socket.on(UPDATE_CANVAS, broadcastUpdateCanvas);
  socket.on(CHANGE_VISIBILITY, emitVisibilityChanged);
  socket.on(NEW_COLLABORATOR, announceCollaboratorAdded);
  socket.on(COLLABORATORS_UPDATED, propagateCollaboratorsUpdated);
};

const initSocketListeners = (server) => {
  const wss = io(server);

  wss.on('connection', (socket) => {
    console.log('Client Connected..');

    // Initialize socket IO event listeners upon establishment of a fresh WebSocket connection.
    initSocketIOEvents(socket);

    // Terminate listener bindings whenever a client terminates its connection.
    socket.on('disconnect', () => {
      console.log('Client Disconnected..');
    });
  });
};

module.exports = initSocketListeners;