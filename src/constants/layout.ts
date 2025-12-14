export const DRAWER_WIDTH = 240;

export const MAIN_CONTENT_STYLES = {
  flexGrow: 1,
  boxSizing: 'border-box',
  width: `calc(100vw - ${DRAWER_WIDTH}px)`,
  minWidth: 0,
  overflowX: 'auto',
  bgcolor: 'background.default',
  pl: '20px',
  pr: '20px',
  pt: 4,
  pb: 0,
  ml: `${DRAWER_WIDTH}px`,
  marginLeft: 0,
} as const;
