import { Button } from "@/components/ui/button"
import { PageHeader } from "../_components/PageHeader"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import db from "@/db/db"
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ActiveToggleDropdownItem,
  DeleteDropdownItem,
} from "./_components/CollectionActions"

export default function AdminCollectionsPage() {
  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <PageHeader>Collections</PageHeader>
        <Button asChild>
          <Link href="/admin/collections/new">Add Collection</Link>
        </Button>
      </div>
      <CollectionsTable />
    </>
  )
}

async function CollectionsTable() {
  const collections = await db.collection.findMany({
    select: {
      id: true,
      name: true,
      isAvailable: true
    },
    orderBy: { name: "asc" },
  })

  if (collections.length === 0) return <p>No collections found</p>

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-0">
            <span className="sr-only">Available For Purchase</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {collections.map(collection => (
          <TableRow key={collection.id}>
            <TableCell>
              {collection.isAvailable ? (
                <>
                  <span className="sr-only">Available</span>
                  <CheckCircle2 />
                </>
              ) : (
                <>
                  <span className="sr-only">Unavailable</span>
                  <XCircle className="stroke-destructive" />
                </>
              )}
            </TableCell>
            <TableCell>{collection.name}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                  <span className="sr-only">Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/collections/${collection.id}/edit`}>
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <ActiveToggleDropdownItem
                    id={collection.id}
                    isAvailable={collection.isAvailable}
                  />
                  <DropdownMenuSeparator />
                  <DeleteDropdownItem
                    id={collection.id}
                    disabled={false}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
