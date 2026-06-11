<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Collection;

class UserService
{
    private UserRepositoryInterface $repository;

    public function __construct(UserRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function getAllUsers(): Collection
    {
        return $this->repository->findAll();
    }

    public function getUserById(int $id): ?User
    {
        return $this->repository->findById($id);
    }

    public function createUser(array $data): User
    {
        $data['password'] = Hash::make($data['password']);
        return $this->repository->create($data);
    }

    public function updateUser(int $id, array $data): ?User
    {
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        return $this->repository->update($id, $data);
    }

    public function deleteUser(int $id): bool
    {
        return $this->repository->delete($id);
    }

    public function findUserByEmail(string $email): ?User
    {
        return $this->repository->findByEmail($email);
    }
}
