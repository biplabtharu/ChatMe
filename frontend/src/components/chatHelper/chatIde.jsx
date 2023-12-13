const getSender = (loggedUser, users) => {
  // console.log(`loogeduser`);
  // console.log(loggedUser);
  // console.log(users[1].name);
  return loggedUser._id === users[0]._id ? users[1].name : users[0].name;
};

const getSenderFull = (loggedUser, users) => {
  return loggedUser._id === users[0]._id ? users[1] : users[0];
  // console.log(user);
  // return user.;
};

const isSameSender = (messages, m, i, userId) => {
  // console.log(`index is ${i}`);
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

const isSameSenderMargin = (messages, m, i, userId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 35;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};

const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

export {
  getSender,
  getSenderFull,
  isSameSender,
  isLastMessage,
  isSameSenderMargin,
  isSameUser,
};
