import { useAlert } from '@dhis2/app-runtime';
const useShowAlerts = () => {
  const {
    show,
    hide
  } = useAlert(_ref => {
    let {
      message
    } = _ref;
    return message;
  }, _ref2 => {
    let {
      type
    } = _ref2;
    return {
      ...type,
      duration: 3000
    };
  });
  return {
    show,
    hide
  };
};
export default useShowAlerts;