export default function initMessageController(db) {
  const create = async (request, response) => {
    const worldId = request.params.id;
    const messageInfo = request.body;
    try {
      const world = await db.World.findOne({
        where: {
          id: worldId,
        },
      });

      if (!world) {
        throw new Error('The world is not found! Message not sent!');
      }

      const user = await db.User.findOne({
        where: {
          id: messageInfo.userId,
        },
      });

      if (!user) {
        throw new Error('The user is not found! Message not sent!');
      }

      let newMessage = await db.Message.create({
        userId: messageInfo.userId,
        worldId: messageInfo.room,
        message: messageInfo.message,
        createdAt: messageInfo.date,
        updatedAt: messageInfo.date,
      });

      newMessage = newMessage.dataValues;

      const successMessage = 'Message sent success!';
      response.send({
        ...newMessage,
        type: successMessage,
      });
    } catch (error) {
      const errorMessage = error.message;
      const resObj = {
        error: errorMessage,
        message: errorMessage,
      };
      response.send(resObj);
    }
  };

  return {
    create,
  };
}
