const ValidationErrorsSerializer = {
    serialize(errors) {
        const serializedErrors = {};
    
        errors.map(item => {
            const fieldName = item.path;
            const validationMessage = item.message;
    
            if (!serializedErrors[fieldName]) {
                serializedErrors[fieldName] = [];
            }
    
            serializedErrors[fieldName].push(validationMessage);
        });
    
        return serializedErrors;
    }
};

module.exports = ValidationErrorsSerializer;