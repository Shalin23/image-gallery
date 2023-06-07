import { configureStore } from '@reduxjs/toolkit';

const initialState = {
  searchTerm: '',
  searchResults: [],
  selectedItem: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload };
    case 'SET_SELECTED_ITEM':
      return { ...state, selectedItem: action.payload };
    default:
      return state;
  }
};

const store = configureStore({
  reducer,
});

export default store;
