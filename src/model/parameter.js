import IO from '../dataIO.js';

const dataIO = new IO();

const setParameter = function (parameterName, parametrValue) {
  dataIO.storeItem('parameter', parameterName, parametrValue);
};

const getParameter = function (parameterName) {
  return dataIO.retrieveItem('parameter', parameterName);
};

export { setParameter, getParameter };