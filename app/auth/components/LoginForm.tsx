import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Alert, Avatar, Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { ValidatedForm } from 'remix-validated-form';
import { LoginValidator } from '~/auth/validation';
import { LabeledCheckbox } from '~/core/components/LabeledCheckbox';
import LabeledTextField from '~/core/components/LabeledTextField';
import { StyledLink } from '~/core/components/StyledLink';
import { SubmitButton } from '~/core/components/SubmitButton';
import { LoginActionData } from '~/routes/login';


interface LoginFormProps {
  actionData: LoginActionData,
  redirectTo?: string
}

export default function LoginForm({ redirectTo, actionData }: LoginFormProps) {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      minHeight={"100vh"}
    >

      <Card variant="elevation">
        <CardContent>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Se connecter
            </Typography>
          </Box>

          {actionData && actionData.errors && <Box sx={{ my: 2 }}>
            <Alert severity="error">
              {actionData.errors.email}
            </Alert>
          </Box>}

          <ValidatedForm
            method="post"
            validator={LoginValidator}
          >
            <LabeledTextField name="email" label="Email" placeholder="Email" />
            <LabeledTextField name="password" label="Password" placeholder="Password" type="password" />
            <input type="hidden" name="redirectTo" value={redirectTo} />

            <Box
              sx={{
                justifyContent: "space-between",
                marginBottom: "1em"
              }}
            >
              <LabeledCheckbox label='Se souvenir de moi' name='remember' />
              <StyledLink to={"/forgot-password"}>
                Mot de passe oublié ?
              </StyledLink>
            </Box>

            <Box
              sx={{
                marginTop: "1em",
              }}
            >
              <SubmitButton fullWidth>Se connecter</SubmitButton>
            </Box>
          </ValidatedForm>
        </CardContent>
      </Card>
    </Grid>
  )
}