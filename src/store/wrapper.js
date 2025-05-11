import { createWrapper } from 'next-redux-wrapper';
import { makeStore } from './index';

export const wrapper = createWrapper(makeStore, { debug: false });
