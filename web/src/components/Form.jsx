import Button from './Button';

export default function Form() {
    return (
        
        <section className="p-6 bg-gray-800 text-gray-50">
        <form noValidate="" action="" className="container flex flex-col mx-auto space-y-12">
            <fieldset className="grid grid-cols-4 gap-6 p-6 rounded-md shadow-sm bg-gray-900">

                    <div className="col-span-full">
                        <label htmlFor="prompt" className="text-sm">Prompt</label>
                        <input id="prompt" type="text" placeholder="" className="w-full rounded-md focus:ring focus:ring-opacity-75 text-gray-900 focus:ring-violet-400 border-gray-700" />
                    </div>

                    <Button text="Generate" />
            </fieldset>
        </form>
    </section>
    );
}