import {Network} from "@/api/Network";

export const RecordNetwork = {
  async listBorrow({
               page, size,
               borrow = undefined, bookId = undefined, readerId = undefined,
               success, fail, reject
             }) {
    return await Network.requestFromParam({
      method: 'get',
      url: `/book/borrow/list/${page}/${size}`,
      config: {
        params: {
          borrow,
          bookId,
          readerId
        }
      },
      success, fail, reject
    })
  },
  async removeBorrowById({
               id,success, fail, reject
             }) {
    return await Network.requestFromParam({
      method: 'delete',
      url: `/book/borrow/${id}`,
      config: {
        params: {
          id
        }
      },
      success, fail, reject
    })
  },

  async listStorage({page, size, empId = undefined, bookId = undefined, storage, success, fail, reject}) {
    return await Network.requestFromJSON({
      method: 'get',
      url: `/book/storage/list/${page}/${size}`,
      config: {
        params: {
          empId, bookId
        }
      },
      success, fail, reject
    })
  },

  async removeStorageById({
                     id,success, fail, reject
                   }) {
    return await Network.requestFromParam({
      method: 'delete',
      url: `/book/storage/${id}`,
      config: {
        params: {
          id
        }
      },
      success, fail, reject
    })
  },
}
