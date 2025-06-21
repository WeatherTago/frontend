import '@emotion/react';

declare module '@emotion/react' {
  export interface Theme {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      text: string;
    };
    spacing: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
    };
    fontSize: {
      body: number;
      title: number;
    };
  }
}
