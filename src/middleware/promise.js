import isPromise from '../utils/isPromise';
import isNil from 'lodash/isNil';
import notification from 'antd/lib/notification';
import message from '../utils/message';

export default () => next => action => {
  if (!(action.payload && isPromise(action.payload.promise))) {
    return next(action);
  }

  const { types, payload, meta } = action;

  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.');
  }

  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.');
  }

  const { promise, data } = payload;
  const [REQUEST, SUCCESS, FAILURE] = types;

  next({
    type: REQUEST,
    ...(!isNil(data) && { payload: data }),
    ...(!isNil(meta) && { meta }),
  });

  // notification.config({
  //   top: 74,
  //   duration: 5,
  // });

  // hide fetch success messages, cause they are too noisy...
  if (!/^FETCH/.test(REQUEST)) {
    notification.info({
      message: message('COMMON_REQUEST'),
      description: message('COMMON_REQUEST'),
    });
  }

  return promise.then(
    response => {
      next({
        type: SUCCESS,
        payload: response,
      });

      // hide fetch success messages, cause they are too noisy...
      if (!/^FETCH/.test(SUCCESS)) {
        notification.success({
          message: message('COMMON_SUCCESS'),
          description: message('COMMON_SUCCESS'),
        });
      }

      return response;
    }
  ).catch(
    error => {
      // next({
      //   type: FAILURE,
      //   payload: error,
      //   error: true,
      // });
      console.log(error);
      const notificationMsg = data => {
        let payload = error.message;
        if (data && data.message) {
          notification.error({
            message: message('COMMON_FAILURE'),
            description: data.message,
          });
          payload = data.message;
        } else {
          const ERROR_MSG = 'ERROR_MSG';
          notification.error({
            message: message('COMMON_FAILURE'),
            description: message(ERROR_MSG),
          });
          payload = message(ERROR_MSG);
        }
        next({
          type: FAILURE,
          payload,
          error: true,
        });
      };

      if (error.response) {
        error.response.json().then(
          function (data) {
            notificationMsg(data);
          },
          function () {
            notificationMsg();
          });
      } else {
        notificationMsg();
      }
      return error;
    }
  );
};
