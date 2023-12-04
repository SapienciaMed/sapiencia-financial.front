import React, { useEffect } from 'react';
import { Grid, Paper, TextField } from '@mui/material';
import useStorePays from '../../../store/store-pays';

const paperStyle = {
  padding: '16px',
  border: '1px solid #ccc',
  borderRadius: '15px',
  marginTop: '50px'
};

const TotalPays: React.FC = () => {
  const { infoErrors, setInfoErrors, infoSearchPays } = useStorePays();

  useEffect(() => {
    setTimeout(() => {
      console.log("oksoak", infoSearchPays[0]);
    }, 1000);
  }, [infoSearchPays]);

  // Extraer los valores del primer elemento de infoSearchPays o establecer valores predeterminados si infoSearchPays es nulo o indefinido
  const { valorCausado = 0, pendienteCausado = 0, valorPagado = 0, pendientePago = 0 } = infoSearchPays?.[0] || {};

  return (
    <Paper elevation={3} style={paperStyle}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <TextField
            type="number"
            label="Total Causado"
            variant="outlined"
            value={valorCausado}
            fullWidth
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            type="number"
            label="Total Pagado"
            variant="outlined"
            value={valorPagado}
            fullWidth
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            type="number"
            label="Pendiente x Pagar"
            variant="outlined"
            value={pendientePago}
            fullWidth
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: true }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            type="number"
            label="Pendiente Causado"
            variant="outlined"
            value={pendienteCausado}
            fullWidth
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: true }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default TotalPays;
