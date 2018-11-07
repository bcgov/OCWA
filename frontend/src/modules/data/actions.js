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

export const saveData = payload => ({
  type: 'data/put',
  payload,
});

export const deleteData = payload => ({
  type: 'data/delete',
  payload,
});

export const createDataAction = type => (...args) => {
  const meta = args.length === 1 ? args[0] : args[1];
  const payload = args.length > 1 ? args[0] : {};

  return {
    type,
    meta,
    payload,
  };
};
