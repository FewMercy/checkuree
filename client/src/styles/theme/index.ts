'use client';

import { createTheme } from '@mui/material';
import customTypography from './typography';

const theme = createTheme({
    breakpoints: {},
    typography: {
        ...customTypography,
    },

    components: {},
});

export default theme;
