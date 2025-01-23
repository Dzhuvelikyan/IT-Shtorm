import {UserInfoType} from '../user-info.type';

export type CommentType = {
  id: string,
  text: string,
  date: string,
  likesCount: number,
  dislikesCount: number,
  user: UserInfoType,
  userAction?: string
}

//тип для получения группы комментариев
export type CommentsPackType = {
    allCount: number,
    comments: CommentType[],
  }
