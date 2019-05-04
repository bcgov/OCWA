import * as React from 'react';
import Button from '@atlaskit/button';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';

import Sidebar from '../sidebar';

const defaultData = {
  _id: '123',
  author: '',
  reviewers: [],
  state: 0,
  files: [],
};
const defaultProps = {
  data: defaultData,
  isSaving: false,
  isEditing: false,
  onCancel: () => null,
  onDelete: () => null,
  onDuplicate: () => null,
  onEdit: () => null,
  onSubmit: () => null,
  onWithdraw: () => null,
};

const renderer = children =>
  mount(<MemoryRouter initialEntries={['/']}>{children}</MemoryRouter>);

const buttonsRenderer = props => {
  const wrapper = renderer(<Sidebar {...props} />);
  return wrapper.find(Button);
};

describe('components/request/sidebar', () => {
  describe('rendering', () => {
    it('should render', () => {
      const wrapper = renderer(<Sidebar {...defaultProps} />);
      expect(wrapper.find(Sidebar).length).toEqual(1);
    });

    it('should render an author name', () => {
      const wrapper = renderer(
        <Sidebar
          {...defaultProps}
          data={{
            ...defaultData,
            author: 'bob',
          }}
        />
      );
      expect(wrapper.find('div#request-author').text()).toEqual('bob');
    });

    it('should show that no reviewer has been assigned', () => {
      const wrapper = renderer(<Sidebar {...defaultProps} />);
      expect(wrapper.find('p#request-reviewers-empty').text()).toEqual(
        'No reviewer has been assigned'
      );
    });

    it('should render one or more reviewers', () => {
      const wrapper1 = renderer(
        <Sidebar
          {...defaultProps}
          data={{
            ...defaultData,
            reviewers: ['bob1'],
          }}
        />
      );
      expect(wrapper1.find('div#request-reviewers').text()).toEqual('bob1');
      const wrapper2 = renderer(
        <Sidebar
          {...defaultProps}
          data={{
            ...defaultData,
            reviewers: ['bob1', 'bob2'],
          }}
        />
      );
      expect(wrapper2.find('div#request-reviewers').find('p').length).toEqual(
        2
      );
    });

    it('should render the correct buttons in draft state', () => {
      const draftButtonsText = [
        'Submit Request',
        'Edit Request',
        'Delete Request',
      ];
      const submittedButtonsText = ['Edit Request', 'Cancel Request'];
      const lockedButtonsText = ['Duplicate Request'];
      const buttonHandler = n => n.text();
      const makeProps = state => ({
        ...defaultProps,
        data: {
          ...defaultData,
          state,
        },
      });

      expect(buttonsRenderer(makeProps(0)).map(buttonHandler)).toEqual(
        draftButtonsText
      );
      expect(buttonsRenderer(makeProps(1)).map(buttonHandler)).toEqual(
        draftButtonsText
      );
      expect(buttonsRenderer(makeProps(2)).map(buttonHandler)).toEqual(
        submittedButtonsText
      );
      expect(buttonsRenderer(makeProps(3)).map(buttonHandler)).toEqual(
        submittedButtonsText
      );
      expect(buttonsRenderer(makeProps(4)).map(buttonHandler)).toEqual(
        lockedButtonsText
      );
      expect(buttonsRenderer(makeProps(5)).map(buttonHandler)).toEqual(
        lockedButtonsText
      );
      expect(buttonsRenderer(makeProps(6)).map(buttonHandler)).toEqual(
        lockedButtonsText
      );
    });
  });

  describe('buttons', () => {
    it('should disable while saving', () => {
      const makeProps = state => ({
        ...defaultProps,
        isSaving: true,
        data: {
          ...defaultData,
          state,
        },
      });
      const reducer = state =>
        buttonsRenderer(makeProps(state))
          .map(n => n.prop('isDisabled'))
          .every(d => d === true);
      expect(reducer(0)).toBeTruthy();
      expect(reducer(1)).toBeTruthy();
      expect(reducer(2)).toBeTruthy();
      expect(reducer(3)).toBeTruthy();
      expect(reducer(4)).toBeTruthy();
      expect(reducer(5)).toBeTruthy();
      expect(reducer(6)).toBeTruthy();
    });

    it('should handle the submitted buttons', () => {
      const onCancel = jest.fn();
      const onWithdraw = jest.fn();
      const wrapper = renderer(
        <Sidebar
          {...defaultProps}
          onCancel={onCancel}
          onWithdraw={onWithdraw}
          data={{
            ...defaultData,
            state: 3,
          }}
        />
      );
      wrapper.find('button#request-sidebar-withdraw-button').simulate('click');
      wrapper.find('button#request-sidebar-cancel-button').simulate('click');
      expect(onCancel).toHaveBeenCalledWith('123');
      expect(global.confirm).toHaveBeenCalled();
      expect(onWithdraw).toHaveBeenCalledWith('123');
    });

    it('should handle the draft buttons', () => {
      const onDelete = jest.fn();
      const onEdit = jest.fn();
      const onSubmit = jest.fn();
      const wrapper = renderer(
        <Sidebar
          {...defaultProps}
          onDelete={onDelete}
          onEdit={onEdit}
          onSubmit={onSubmit}
          data={{
            ...defaultData,
            files: ['1223'],
            state: 1,
          }}
        />
      );
      wrapper.find('button#request-sidebar-delete-button').simulate('click');
      wrapper.find('button#request-sidebar-edit-button').simulate('click');
      wrapper.find('button#request-sidebar-submit-button').simulate('click');
      expect(onDelete).toHaveBeenCalledWith('123');
      expect(onEdit).toHaveBeenCalledWith('123');
      expect(onSubmit).toHaveBeenCalledWith({
        ...defaultData,
        files: ['1223'],
        state: 1,
      });
    });

    it('should have a disabled submit button if necessary', () => {
      const wrapper = renderer(
        <Sidebar
          {...defaultProps}
          data={{
            ...defaultData,
            state: 1,
          }}
        />
      );
      const button = wrapper.find('button#request-sidebar-submit-button');
      expect(button.prop('disabled')).toBeTruthy();
    });

    it('should handle the duplicate button', () => {
      const onDuplicate = jest.fn();
      const data = {
        ...defaultData,
        state: 6,
      };
      const wrapper = renderer(
        <Sidebar {...defaultProps} onDuplicate={onDuplicate} data={data} />
      );
      wrapper.find('button#request-sidebar-duplicate-button').simulate('click');
      expect(onDuplicate).toHaveBeenCalledWith(data);
    });
  });
});
