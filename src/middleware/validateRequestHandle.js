export function validateRequest(schema) {
  return (req, res, next) => {
    // Validar query, params y body según lo que venga en el esquema
    if (schema.query) {
      const result = schema.query.safeParse(req.query);
      if (!result.success) {
        const errorsMessage = result.error.issues.map((issue) => issue.message);
        return res.status(400).json({
          message: "Validation error in query",
          errors: errorsMessage,
        });
      }
    }

    if (schema.params) {
      const result = schema.params.safeParse(req.params);
      if (!result.success) {
        const errorsMessage = result.error.issues.map((issue) => issue.message);
        return res.status(400).json({
          message: "Validation error in params",
          errors: errorsMessage,
        });
      }
    }

    if (schema.body) {
      const result = schema.body.safeParse(req.body);
      if (!result.success) {
        if(result.error.issues[0].expected === "object"){
            return res.status(400).json({
                message: "Validation error in body",
                errors: "No se recibio el body",
            });
        }
        const errorsMessage = result.error.issues.map((issue) => issue.message);
        return res.status(400).json({
          message: "Validation error in body",
          errors: errorsMessage,
        });
      }
    }

    if (schema.files) {
      const result = schema.files.safeParse(req.files);
      if (!result.success) {
        console.log(result.error.issues)
        const errorsMessage = result.error.issues.map((issue) => {

          // issue.path[0] normalmente contendrá el nombre del campo del archivo
          const campo = issue.path?.[0] ?? "archivo";
          return `${campo}: ${issue.message}`;
        });
        return res.status(400).json({
          message: "Validation error in files",
          errors: errorsMessage,
        });
      }
    }

    next();
  };
}