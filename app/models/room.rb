class Room < ApplicationRecord
  has_many :users, through: :room_users
  has_many :messags

  validates :thread_name, presence: true
end
