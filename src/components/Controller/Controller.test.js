import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import Controller from './Controller.js';

const mockStore = configureMockStore();
const store = mockStore({});

describe("Controller", () => {
  it("should check state, which is equivalent to passed props", () => {
        expect(
            shallow(
                <Provider store={store}>
                    <Controller />
                </Provider>
            )
        );
    });
});
