import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

interface CdpPaginatorProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#533893',
    },
  },
});

const CdpPaginator: React.FC<CdpPaginatorProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(value);
  };

  const handlePrevClick = () => {
    onPageChange(currentPage - 1);
  };

  const handleNextClick = () => {
    onPageChange(currentPage + 1);
  };

  return (
    <ThemeProvider theme={theme}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Button onClick={handlePrevClick} disabled={currentPage === 1} color="primary">
          Anterior
        </Button>
        <Pagination count={totalPages} page={currentPage} color="primary" onChange={handlePageChange} />
        <Button onClick={handleNextClick} disabled={currentPage === totalPages} color="primary">
          Siguiente
        </Button>
      </Stack>
    </ThemeProvider>
  );
};

export default CdpPaginator;
