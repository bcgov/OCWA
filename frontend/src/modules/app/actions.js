export const fetchToken = () => ({
  type: 'app/get/token',
});

export const toggleAbout = () => ({
  type: 'app/about/toggle',
});

export default {
  fetchToken,
  toggleAbout,
};
