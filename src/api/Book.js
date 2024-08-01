import {Network} from "@/api/Network";

export const BookNetwork = {
  async list({page, size, book = undefined, success, fail, reject}) {
    return await Network.requestFromJSON({
      method: 'POST',
      url: `/book/list/${page}/${size}`,
      config: {
        data: {
          ...(book || {})
        }
      },
      success, fail, reject
    })
  },
  async listTb({page, size, book = undefined, success, fail, reject}) {
    return await Network.requestFromJSON({
      method: 'POST',
      url: `/book/tb/list/${page}/${size}`,
      config: {
        data: {
          ...(book || {})
        }
      },
      success, fail, reject
    })
  },
  async modify({book, success, fail, reject}) {
    return await Network.requestFromJSON({
      method: 'post',
      url: '/book/update',
      data: book,
      success, fail, reject
    })
  },

  async typeList({page, size, type = undefined, success, fail, reject}) {
    return await Network.requestFromJSON({
      method: 'POST',
      url: `/book/type/list/${page}/${size}`,
      config: {
        data: {
          ...(type || {})
        }
      },
      success, fail, reject
    })
  },
  async removeById({id, success, fail, reject}) {
    return await Network.requestFromParam({
      method: 'delete',
      url: `/book/remove?id=${id}`,
      success, fail, reject
    })
  },
  async add(book, success, fail, reject) {
    return await Network.requestFromJSON({
      method: 'post',
      url: '/book/add',
      data: book,
      success, fail, reject
    })
  },
  async listReaderUnreturnByTel({tel, success, fail, reject}) {
    return await Network.requestFromJSON({
      method: 'get',
      url: '/book/reader/unreturn/list/tel/' + tel,
      success, fail, reject
    })
  },
  async listReaderUnreturnById({readerId, success, fail, reject}) {
    return await Network.requestFromJSON({
      method: 'get',
      url: '/book/reader/unreturn/list/id/' + readerId,
      success, fail, reject
    })
  },
  async borrowBook({readerId, bookId, success, fail, reject}) {
    return await Network.requestFromJSON({
      method: 'put',
      url: `/book/borrow/${readerId}/${bookId}`,
      success, fail, reject
    })
  },
  async returnBook({readerId, bookId, time = undefined, success, fail, reject}) {
    let urlS = time ? '/' + time : '';
    return await Network.requestFromJSON({
      method: 'post',
      url: `/book/return/${readerId}/${bookId}` + urlS,
      success, fail, reject
    })
  },
  async storage({storage, success, fail, reject}) {
    return await Network.requestFromJSON({
      method: 'put',
      url: '/book/storage',
      config: {data: storage},
      success, fail, reject
    })
  }
}
