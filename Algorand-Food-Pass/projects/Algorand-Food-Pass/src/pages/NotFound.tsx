import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import { Card, CardContent } from '../ui/Card'

export default function NotFound() {
  return (
    <Card>
      <CardContent className="flex flex-col items-start gap-3">
        <div className="text-xl font-semibold">Page not found</div>
        <Link to="/">
          <Button>Back home</Button>
        </Link>
      </CardContent>
    </Card>
  )
}
