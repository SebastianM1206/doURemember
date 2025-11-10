export const TaskModal = ({url, onClick, buttonText, onChange, value, disabled}) => {

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50" >
            <div className="relative bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-slideIn" >
                <div>
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 tracking-tight" >
                        DESCRIBE IMAGENES
                    </h2>
                </div>
                <div className="w-full h-60 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex justify-center items-center mb-6 overflow-hidden border-3 border-gray-300" >
                    <img  className="text-5xl text-white font-light tracking-widest" src={url}/>
                </div>
                <div>
                    <p>Realiza la descripcion aqui abajo ↓</p>
                </div>
                <div className="mb-6" >
                    <textarea
                    onChange={onChange}
                    value={value}
                    className="w-full min-h-[160px] p-2 text-base border-2 border-gray-300 rounded-xl resize-none transition-all duration-300 text-gray-800 focus:outline-none"
                    required
                    >
                    </textarea>
                </div>
                <div className="flex justify-center" >
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3.5 text-base font-semibold rounded-xl cursor-pointer"
                    onClick={onClick}
                    disabled={disabled}>
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    )
}
