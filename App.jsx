import Restaurant from "./Restaurant";

function App() {
  return (
    <Restaurant
      name="Тратторія Бруно"
      address="м. Київ, вул. Хрещатик, 22"
      rating={4.6}
      cuisine="Італійська"
      image="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900"
    />
  );
}

export default App;
