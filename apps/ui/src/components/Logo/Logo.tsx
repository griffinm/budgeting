interface Props {
  size?: 'small' | 'medium' | 'large';
}

const SRC = {
  small: '/assets/logo/logo-small.png',
  medium: '/assets/logo/logo-small.png',
  large: '/assets/logo/logo.png',
}

const HEIGHT = {
  small: 100,
  medium: 150,
  large: 250,
}

export function Logo({
  size = 'small',
}: Props) {

  const src = SRC[size];
  const height = HEIGHT[size];

  return (
    <img src={src} alt="Budgeting" height={height} width={height} />
  )
}
