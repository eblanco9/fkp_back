//los campos de los archivos vendran asi
/**
 *
    user.recibo_sueldo.0
    user.recibo_sueldo.1
    user.extracto_bancario.0

    fam.fam_1.recibo_sueldo.0
    fam.fam_1.recibo_bancario.1

    fam.fam_2.acta_nacimiento.0
 */

function parseUploadedFiles() {
  return (req, res, next) => {
    const files = req.files || [];

    const result = {
      user: {},
      families: {}
    };

    for (const file of files) {
      if (!file.fieldname) continue;

      const parts = file.fieldname.split(".");

      const scope = parts[0]; // user | fam

      // 👤 USER
      if (scope === "user") {
        const docType = parts[1];

        if (!result.user[docType]) {
          result.user[docType] = [];
        }

        result.user[docType].push(file);
      }

      // 👨‍👩‍👧 FAMILIES
      if (scope === "fam") {
        const familyId = parts[1];
        const docType = parts[2];

        if (!result.families[familyId]) {
          result.families[familyId] = {};
        }

        if (!result.families[familyId][docType]) {
          result.families[familyId][docType] = [];
        }

        result.families[familyId][docType].push(file);
      }
    }

    // 🔥 lo dejamos listo para el service
    req.parsedFiles = result;

    next();
  };
}

export default parseUploadedFiles;