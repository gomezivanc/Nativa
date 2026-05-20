<?php

namespace App\Http\Resources;

use App\Models\Menu;
use Illuminate\Http\Resources\Json\JsonResource;

class MenuResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $data = [
            'id' => $this->id,
            'title' => $this->title,
            'parentId' => $this->parent_id,
            'type' => $this->type,
            'target' => $this->target,
            'icon' => $this->icon,
            'uri' => $this->uri,
            'status' => $this->status,
            'createdBy' => $this->created_by,
            'updatedBy' => $this->updated_by,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
        ];
        if (count($this->children) > 0) {
            $data['children'] = MenuResource::collection($this->children);
        }
        return $data;
    }
}
