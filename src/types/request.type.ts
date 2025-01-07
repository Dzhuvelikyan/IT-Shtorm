import {RequestEnum} from '../enum/request.enum';

//тип для пост заапросов на консультацию и заказ услуги
export type RequestType = {
  name: string,
  phone: string,
  service?: string,
  type: RequestEnum
}
