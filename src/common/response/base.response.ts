import { Response } from 'express';
import { BaseResponse } from './dto';

export const sendResponse = <T>(
  res: Response,
  status: number,
  responseData: BaseResponse<T>,
) => {
  return res.status(status).json(responseData);
};
