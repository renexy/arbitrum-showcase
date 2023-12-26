import { Box, Button, Checkbox, Paper, Step, StepButton, Stepper, Typography } from '@mui/material'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import React from 'react';

export default function paper() {
    
  const steps = ['Select grant settings', 'Create a grant description', 'Create a grant'];

  // stepper logic
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
        // find the first step that has been completed
        steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };
  //end steper logic

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Ticker', width: 110 },
    {
      field: 'platform',
      headerName: 'Platform',
      width: 150,
      editable: true,
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 180,
      editable: true,
    },
    {
      field: 'price',
      headerName: 'Price',
      type: 'number',
      width: 110,
      editable: true,
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 190,
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.id || ''} ${params.row.name || ''}`,
    },
  ];

  const rows = [
    { id: "ADA", name: 'Cardano', platform: 'Binance', price: 125 },
    { id: "XRP", name: 'Ripple', platform: 'Binance', price: 222 },
    { id: "BTC", name: 'Bitcoin', platform: 'Binance', price: 444 },
    { id: "ETH", name: 'Ethereum', platform: 'Binance', price: 15 },
    { id: "KAS", name: 'Kaspa', platform: 'Binance', price: null },
    { id: "GRT", name: 'The Graph', platform: null, price: 1555 },
    { id: "MATIC", name: 'Polygon', platform: 'Binance', price: 2451 },
    { id: "RNDR", name: 'Render Token', platform: 'Binance', price: 25 },
    { id: "QNT", name: 'Quant', platform: 'Binance', price: 34 },
  ];

  return (
    <>
      <Paper square={false} elevation={3} sx={{
          flexGrow: "0.5",
          paddingTop: "24px", paddingBottom: "24px", display: "flex", justifyContent: "center", flexDirection: "column",
          alignItems: "center", gap: "20px"
      }}>
          <Typography
          variant="h4"
          noWrap
          component="a"
          sx={{
              fontFamily: 'monospace',
              fontWeight: 900,
              letterSpacing: '.3rem',
              color: '#607d8b',
              textDecoration: 'none',
          }}
          >
          Grant seekers
          </Typography>
          <Box sx={{ width: '100%' }}>
          <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
              pagination: {
                  paginationModel: {
                  pageSize: 8,
                  },
              },
              }}
              pageSizeOptions={[5]}
              checkboxSelection
              disableRowSelectionOnClick
              sx={{
              '.Mui-checked': {
                  color: '#607d8b'
              }
              }}
          />
          </Box>
      </Paper>

      <Paper square={false} elevation={3} sx={{
          flexGrow: "0.5",
          paddingTop: "24px", paddingBottom: "24px", display: "flex", justifyContent: "center", flexDirection: "column",
          alignItems: "center", gap: "20px"
      }}>
          <Typography
          variant="h4"
          noWrap
          component="a"
          sx={{
              fontFamily: 'monospace',
              fontWeight: 900,
              letterSpacing: '.3rem',
              color: '#607d8b',
              textDecoration: 'none',
          }}
          >
          Create a grant
          </Typography>
          <Box sx={{ width: '100%', padding: "15px" }}>
          <Stepper nonLinear activeStep={activeStep}
              sx={{
              flexDirection: { xs: 'column', sm: 'row' },
              gap: "8px", justifyContent: "center", alignItems: { xs: 'flex-start', sm: 'center' }
              }}>
              {steps.map((label, index) => (
              <Step key={label} completed={completed[index]} sx={{ '.Mui-active': { color: '#607d8b' } }}>
                  <StepButton color="inherit" onClick={handleStep(index)}>
                  {label}
                  </StepButton>
              </Step>
              ))}
          </Stepper>
          <div>
              {allStepsCompleted() ? (
              <React.Fragment>
                  <Typography sx={{ mt: 2, mb: 1 }}>
                  All steps completed - you&apos;re finished
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                  <Box sx={{ flex: '1 1 auto' }} />
                  <Button onClick={handleReset}>Reset</Button>
                  </Box>
              </React.Fragment>
              ) : (
              <React.Fragment>
                  <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
                  Step {activeStep + 1}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                  <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                  >
                      Back
                  </Button>
                  <Box sx={{ flex: '1 1 auto' }} />
                  <Button onClick={handleNext} sx={{ mr: 1 }}>
                      Next
                  </Button>
                  {activeStep !== steps.length &&
                      (completed[activeStep] ? (
                      <Typography variant="caption" sx={{ display: 'inline-block' }}>
                          Step {activeStep + 1} already completed
                      </Typography>
                      ) : (
                      <Button onClick={handleComplete}>
                          {completedSteps() === totalSteps() - 1
                          ? 'Finish'
                          : 'Complete Step'}
                      </Button>
                      ))}
                  </Box>
              </React.Fragment>
              )}
          </div>
          </Box>
      </Paper>
    </>
  )
}