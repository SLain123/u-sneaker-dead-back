export enum AUTH_ERRS {
  userExists = 'User with this email has already been registered before',
}

export enum USER_ERRS {
  userNotExist = 'User does not exist',
  uncorrectPassword = 'Password is not correct',
  prohibitedData = 'Email, password or shoe/run lists prohibited for modification via this route',
}

export enum SHOE_ERRS {
  shoeNotExist = 'Shoe does not exist',
  shoeNoBelongUser = 'Shoe belongs to another user',
  shoeDurability = 'Field current durability forbinned for changing',
  shoeIdIncorrect = 'Shoe id is incorrect',
}

export enum RUN_ERRS {
  runNotExist = 'Run does not exist',
  runNoBelongUser = 'Run belongs to another user',
  runShoe = 'Field shoe forbinned for direct changing, use shoeId field',
}
