import '../styles/global.css'

const Page = ({ }) => {
    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("image", event.target.image.files[0]);
        formData.append("title", event.target.title.value);
        formData.append("description", event.target.description.value);

        const response = await fetch(`${process.env.REACT_APP_PROXY_SERVER}/api/blog`, {
            method: "POST",
            credentials: 'include',
            body: formData
        });

    }

    return (
        <div>
            <h1 className="title">Create Blog</h1>
            <div className="card glass center box">
                <form onSubmit={handleSubmit}>
                    <label>Title</label>
                    <div>
                        <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" name="title" />
                    </div>
                    <label>Description</label>
                    <div className='description'>
                        <textarea type="text" className="input input-bordered w-full" name="description" />
                    </div>
                    <div>
                        <div>
                            <button className="btn btn-neutral">submit</button>
                            <input type="file" name="image" className="file-input file-input-bordered" />
                        </div>
                    </div>
                </form>
            </div>
        </div >
    )
}

export default Page;