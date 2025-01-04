import Header from './components/Header';
import Form from './components/Form';

export default function App() {

  return (
    <div className="bg-gray-900 h-screen">
      <Header />

      <h2 className="text-3xl font-bold text-white pt-10 mx-auto bg-gray-800 text-center">Type in a prompt to get started</h2>

      <Form />
    </div>
  )
}
