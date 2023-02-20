import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

export const Copyright = (): JSX.Element => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"All rights reserved - Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Appetize
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};
