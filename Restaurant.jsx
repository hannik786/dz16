import { useState } from "react";
import PropTypes from "prop-types";
import "./Restaurant.css";

const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500">
      <rect width="100%" height="100%" fill="#dde4e1"/>
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
            font-family="sans-serif" font-size="28" fill="#5f6f6a">Немає зображення</text>
    </svg>`
  );

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Вкажіть назву";
  if (!values.address.trim()) errors.address = "Вкажіть адресу";
  if (!values.cuisine.trim()) errors.cuisine = "Вкажіть тип кухні";

  const rating = Number(values.rating);
  if (values.rating === "" || Number.isNaN(rating) || rating < 0 || rating > 5) {
    errors.rating = "Рейтинг — число від 0 до 5";
  }
  return errors;
}

function Restaurant({ name, address, rating, cuisine, image = "" }) {
  // Поточні (збережені) дані ресторану. Початкові значення беремо з props.
  const [info, setInfo] = useState({ name, address, rating, cuisine, image });
  // Режим перегляду / редагування
  const [isEditing, setIsEditing] = useState(false);
  // Чернетка: те, що користувач вводить у форму, поки не натисне «Зберегти»
  const [draft, setDraft] = useState(info);
  const [errors, setErrors] = useState({});

  const startEditing = () => {
    setDraft({ ...info, rating: String(info.rating) });
    setErrors({});
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setErrors({});
    setIsEditing(false);
  };

  const handleChange = (event) => {
    const { name: field, value } = event.target;
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const foundErrors = validate(draft);
    setErrors(foundErrors);
    if (Object.keys(foundErrors).length > 0) return;

    setInfo({
      name: draft.name.trim(),
      address: draft.address.trim(),
      rating: Number(draft.rating),
      cuisine: draft.cuisine.trim(),
      image: draft.image.trim(),
    });
    setIsEditing(false);
  };

  const handleImageError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = FALLBACK_IMAGE;
  };

  return (
    <article className="restaurant">
      <img
        className="restaurant__photo"
        src={info.image || FALLBACK_IMAGE}
        alt={`Будівля ресторану «${info.name}»`}
        onError={handleImageError}
      />

      {isEditing ? (
        <form className="restaurant__form" onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span>Назва</span>
            <input name="name" value={draft.name} onChange={handleChange} />
            {errors.name && <em className="field__error">{errors.name}</em>}
          </label>

          <label className="field">
            <span>Адреса</span>
            <input name="address" value={draft.address} onChange={handleChange} />
            {errors.address && <em className="field__error">{errors.address}</em>}
          </label>

          <div className="restaurant__row">
            <label className="field">
              <span>Рейтинг (0–5)</span>
              <input
                name="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={draft.rating}
                onChange={handleChange}
              />
              {errors.rating && <em className="field__error">{errors.rating}</em>}
            </label>

            <label className="field">
              <span>Тип кухні</span>
              <input name="cuisine" value={draft.cuisine} onChange={handleChange} />
              {errors.cuisine && <em className="field__error">{errors.cuisine}</em>}
            </label>
          </div>

          <label className="field">
            <span>Посилання на зображення</span>
            <input
              name="image"
              type="url"
              placeholder="https://..."
              value={draft.image}
              onChange={handleChange}
            />
          </label>

          <div className="restaurant__actions">
            <button type="submit" className="btn btn--primary">
              Зберегти
            </button>
            <button type="button" className="btn" onClick={cancelEditing}>
              Скасувати
            </button>
          </div>
        </form>
      ) : (
        <div className="restaurant__body">
          <h2 className="restaurant__name">{info.name}</h2>
          <p className="restaurant__address">{info.address}</p>

          <dl className="restaurant__meta">
            <div>
              <dt>Рейтинг</dt>
              <dd>★ {info.rating.toFixed(1)} / 5</dd>
            </div>
            <div>
              <dt>Кухня</dt>
              <dd>{info.cuisine}</dd>
            </div>
          </dl>

          <button type="button" className="btn" onClick={startEditing}>
            Редагувати
          </button>
        </div>
      )}
    </article>
  );
}

Restaurant.propTypes = {
  name: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  cuisine: PropTypes.string.isRequired,
  image: PropTypes.string,
};

export default Restaurant;
