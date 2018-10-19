export const fetchData = request => ({
  type: 'data/get',
  meta: {
    identifier: request.identifier,
  },
  payload: request.get,
});

export const createData = payload => ({
  type: 'data/post',
  payload,
});

export const saveData = (request, payload) => ({
  type: 'data/put',
});

export const deleteData = request => ({
  type: 'data/delete',
});
