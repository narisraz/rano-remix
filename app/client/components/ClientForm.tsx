import { Alert, Box, Button, Divider } from "@mui/material"
import { Address, Client } from "@prisma/client"
import { ValidatedForm, Validator } from "remix-validated-form"
import LabeledTextField from "~/core/components/LabeledTextField"


export interface ClientFormProps {
  children?: JSX.Element
  title: string
  client?: Client
  address?: Address
  action: string
  validator: Validator<{ [x: string]: any; }>
  actionData?: ClientActionData
}

export interface ClientActionData {
  errors?: {
    email?: string;
  };
}

export const ClientForm = ({ children, title, client, address, action, validator, actionData }: ClientFormProps) => {
  return (
    <Box>
      <h3>{title}</h3>
      <Divider />
      <ValidatedForm
        method="post"
        action={action}
        validator={validator}
        defaultValues={{
          name: client?.name ?? '',
          email: client?.email ?? '',
          telephones: client?.telephones ?? '',
          nif: client?.nif ?? '',
          stat: client?.stat ?? '',
          region: address?.region ?? '',
          commune: address?.commune ?? '',
          fokontany: address?.fokontany ?? '',
          lot: address?.lot ?? ''
        }}
      >
        {actionData && actionData?.errors && <Box sx={{ my: 2 }}>
          <Alert severity="error">
            {actionData.errors.email}
          </Alert>
        </Box>}
        {children}
        <Box sx={{ mb: 2 }}>
          <LabeledTextField label="Nom" name="name" placeholder="name" />
          <LabeledTextField label="Email" name="email" placeholder="Email" />
          <LabeledTextField label="Téléphones" name="telephones" placeholder="telephones" />
          <LabeledTextField label="NIF" name="nif" placeholder="NIF" />
          <LabeledTextField label="Stat" name="stat" placeholder="Stat" />
          <LabeledTextField label="Région" name="region" placeholder="Région" />
          <LabeledTextField label="Commune" name="commune" placeholder="Commune" />
          <LabeledTextField label="Fokontany" name="fokontany" placeholder="Fokontany" />
          <LabeledTextField label="Lot" name="lot" placeholder="Lot" />
        </Box>
        <Button variant={"contained"} type={"submit"}>Sauvegarder</Button>
      </ValidatedForm>
    </Box>
  )
}

export default ClientForm