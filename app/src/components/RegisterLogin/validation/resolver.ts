import { useCallback } from "react";
import { ObjectSchema, ValidationError } from "yup";

export const useYupValidationResolver = (validationSchema: ObjectSchema<{}>) =>
  useCallback(
    async (data) => {
      try {
        const values = await validationSchema.validate(data, {
          abortEarly: false,
        });

        return {
          values,
          errors: {},
        };
      } catch (errors: any) {
        return {
          values: {},
          errors: errors.inner.reduce(
            (allErrors: ValidationError, currentError: ValidationError) => ({
              ...allErrors,
              [currentError?.path?.toString() ?? "undefined"]: {
                // todo: handle with counter ?
                type: currentError.type ?? "validation",
                message: currentError.message,
              },
            }),
            {}
          ),
        };
      }
    },
    [validationSchema]
  );
