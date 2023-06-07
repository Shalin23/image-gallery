import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TextField, Button, Typography, Grid, Card, CardContent, CardMedia, Box } from '@mui/material';
import axios from 'axios';

const App = () => {
  const searchTerm = useSelector((state) => state.searchTerm);
  const searchResults = useSelector((state) => state.searchResults);
  const selectedItem = useSelector((state) => state.selectedItem);
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchData() {
      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();
      try {
        const API_KEY = '37074119-45f654898b241d1f073892c15';
        const response = await axios.get(`https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(
          searchTerm
        )}&image_type=photo&page=${page}&safesearch=true`, {
          cancelToken: source.token,
        });
        const hits = response.data.hits;
        const total = response.data.total;
        setTotalPages(Math.ceil(total / 20));
        dispatch({ type: 'SET_SEARCH_RESULTS', payload: hits });
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          console.log(error);
        }
      }
      source.cancel('Operation canceled by the user.');
    }
    fetchData();
  }, [dispatch, page, searchTerm]);

  const handleSearch = async () => {
    setPage(1);
  };

  const handleItemClick = (item) => {
    dispatch({ type: 'SET_SELECTED_ITEM', payload: item });
  };

  const handleInputChange = (e) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value });
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  return (
    <div>
      <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" mt={4}>
        <Typography variant="h4">Image Search</Typography>
        <Box mt={2}>
          <TextField
            label="Search Term"
            variant="outlined"
            value={searchTerm}
            onChange={handleInputChange}
          />
          <Button variant="contained" color="primary" onClick={handleSearch} style={{ marginLeft: '10px' }}>
            Search
          </Button>
        </Box>
        <Box mt={4} width="800px">
          <Grid container spacing={3}>
            {searchResults
              .filter((hit) => hit.tags.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((hit) => (
                <Grid item xs={12} sm={6} md={4} key={hit.id}>
                  <Card onClick={() => handleItemClick(hit)} style={{ height: '100%' }}>
                    <CardMedia component="img" alt={hit.tags} height="140" image={hit.previewURL} />
                    <CardContent>
                      <Typography variant="subtitle1" style={{ textTransform: 'capitalize' }}>
                        {hit.tags}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        By: {hit.user}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
          <Box mt={4} display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              disabled={page === 1}
              onClick={handlePreviousPage}
              style={{ marginRight: '10px' }}
            >
              Previous Page
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={page === totalPages}
              onClick={handleNextPage}
            >
              Next Page
            </Button>
          </Box>
        </Box>
        {selectedItem && (
          <Box mt={4}>
            <Typography variant="h6">{selectedItem.tags}</Typography>
            <Typography variant="body1">By: {selectedItem.user}</Typography>
            <img
              src={selectedItem.largeImageURL}
              alt={selectedItem.tags}
              style={{ marginTop: '10px', width: '100%' }}
            />
          </Box>
        )}
      </Box>
    </div>
  );
};

export default App;
