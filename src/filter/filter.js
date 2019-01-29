import { formatBytes } from '../util/fileUtils';

// add filters you want to register globally
export default {
  formatBytes: value => formatBytes(value),
  reverse: value =>
    value
      .split('')
      .reverse()
      .join(''),
};
