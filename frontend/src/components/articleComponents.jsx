export const Heading =({content})=>{
    return  <h2 className="text-2xl font-bold mt-8 mb-4 font-serif text-black">{content}</h2>
}
export const Subheading = ({content})=>{
    return <h3 className="text-xl font-bold mt-6 mb-3 font-serif text-gray-800">{content}</h3>
}
export const Image =({content})=>{
    return <img src={content} className="w-full rounded-lg my-8" alt="Article image" />
}
export const List =({content})=>{
    const items = content.split('\n').filter(item => item.trim() !== '');
    return (
        <ul className="list-disc list-outside ml-6 space-y-2 my-4 font-serif text-xl">
            {items.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
        </ul>
    );
}
    

export const Text =({content})=>{
    return <p className="font-serif text-xl mb-6">{content.replace(/\n/g, '<br/>')}</p>
}


