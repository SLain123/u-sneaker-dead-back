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
  shoeForbidenFields = 'Fields current durability and active forbinned for changing',
  shoeIdIncorrect = 'Shoe id is incorrect',
  shoeCalculateError = 'Recalculation of currentDurability was unsuccessful',
  shoeWrongInitDurability = "Init durability couldn't be less or euals total durability",
}

export enum RUN_ERRS {
  runNotExist = 'Run does not exist',
  runNoBelongUser = 'Run belongs to another user',
  runShoe = 'Field shoe forbinned for direct changing, use shoeId field',
}

export enum STAT_ERRS {
  emptyDurability = 'Shoe have empty durability',
  emptyAvgDistancePerWeek = 'User no have enought runs for calculate average distance per week',
}
