import { SiteClient } from 'datocms-client';

export default async function requestReceiver(request, response) {

    if(request.method === 'POST') {
        const TOKEN = '31f400eb0eee7951971dd1ff55f529';  
        const client = new SiteClient(TOKEN);

        const createRegister = await client.items.create({
            itemType: "971591",
            ...request.body,
            //title: "Comunidade 1 - Teste", 
            //imageUrl: "https://github.com/Fino59.png",
            //creatorSlug: "Fino59"
        })

        console.log(createRegister);

        response.json({
            dados: 'Aqui vão os dados',
            createRegister: createRegister,
        })

        return;
    }

    response.status(404).json({
        message: 'Nothing to GET here. Only on POST'
    })
}