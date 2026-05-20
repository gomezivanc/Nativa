export async function exportBase64(file) {
    const reader = new FileReader();

    // Retornar una promesa que se resuelve cuando el FileReader termina
    return new Promise((resolve, reject) => {
        reader.onload = () => {
            resolve({
                file: {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    lastModified: file.lastModified,
                    lastModifiedDate: new Date(file.lastModified).toISOString(),
                },
                base64: reader.result,
                base64Only: reader.result.split(',')[1],
            });
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsDataURL(file);
    });
}
